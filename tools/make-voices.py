"""Gera os áudios com voz natural (Piper) para o app Inglesei.

Roda no GitHub Actions (que tem acesso aos modelos de voz). Saída:
  www/audio/<voz>/<hash>.ogg                       frases do app
  www/audio/<voz>/lembrete_<n>.ogg                 frases dos lembretes (prévia no app)
  android/app/src/main/res/raw/lembrete_<voz>_<n>.ogg   som das notificações
  www/audio/index.json                             lista do que existe

Uso: python tools/make-voices.py  (depois de: node tools/export-texts.mjs)
"""
import json
import subprocess
import sys
import tempfile
import wave
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from piper import PiperVoice, SynthesisConfig

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "tools" / "voice-texts.json").read_text(encoding="utf-8"))
MODELS_DIR = ROOT / ".voices-cache"
AUDIO_DIR = ROOT / "www" / "audio"
RAW_DIR = ROOT / "android" / "app" / "src" / "main" / "res" / "raw"

# Ritmo de conversa normal (1.0 = padrão do modelo; menor = mais rápido).
SPEED = SynthesisConfig(length_scale=0.95)


def fnv1a(text: str) -> str:
    """Mesmo cálculo de src/voicehash.js."""
    h = 0x811C9DC5
    for b in " ".join(text.split()).encode("utf-8"):
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


def to_ogg(wav_path: Path, out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-y", "-i", str(wav_path),
         "-ac", "1", "-c:a", "libopus", "-b:a", "24k", "-application", "voip", str(out_path)],
        check=True,
    )


def synth(voice: PiperVoice, text: str, out_path: Path, tmp: Path) -> None:
    wav_path = tmp / (out_path.stem + ".wav")
    with wave.open(str(wav_path), "wb") as wav_file:
        voice.synthesize_wav(text, wav_file, syn_config=SPEED)
    to_ogg(wav_path, out_path)
    wav_path.unlink()


def main() -> None:
    MODELS_DIR.mkdir(exist_ok=True)
    models = [v["model"] for v in DATA["voices"]]
    missing = [m for m in models if not (MODELS_DIR / f"{m}.onnx").exists()]
    if missing:
        subprocess.run([sys.executable, "-m", "piper.download_voices", *missing, "--download-dir", str(MODELS_DIR)], check=True)

    done = {"voices": [], "texts": [], "reminders": len(DATA["reminders"])}
    for v in DATA["voices"]:
        voice = PiperVoice.load(MODELS_DIR / f"{v['model']}.onnx")
        out_dir = AUDIO_DIR / v["id"]
        jobs = []
        with tempfile.TemporaryDirectory() as tmp_name, ThreadPoolExecutor(max_workers=4) as pool:
            tmp = Path(tmp_name)
            for item in DATA["texts"]:
                assert fnv1a(item["text"]) == item["hash"], item["text"]
                out = out_dir / f"{item['hash']}.ogg"
                if not out.exists():
                    wav_path = tmp / f"{item['hash']}.wav"
                    with wave.open(str(wav_path), "wb") as wav_file:
                        voice.synthesize_wav(item["text"], wav_file, syn_config=SPEED)
                    jobs.append(pool.submit(lambda w=wav_path, o=out: (to_ogg(w, o), w.unlink())))
            for n, text in enumerate(DATA["reminders"]):
                clip = out_dir / f"lembrete_{n}.ogg"
                if not clip.exists():
                    synth(voice, text, clip, tmp)
                raw = RAW_DIR / f"lembrete_{v['id']}_{n}.ogg"
                raw.parent.mkdir(parents=True, exist_ok=True)
                raw.write_bytes(clip.read_bytes())
            for j in jobs:
                j.result()
        done["voices"].append({k: v[k] for k in ("id", "name", "gender")})
        print(f"{v['name']}: ok", flush=True)

    done["texts"] = [item["hash"] for item in DATA["texts"]]
    (AUDIO_DIR / "index.json").write_text(json.dumps(done), encoding="utf-8")
    size = sum(f.stat().st_size for f in AUDIO_DIR.rglob("*.ogg"))
    print(f"Áudios prontos: {len(done['texts'])} frases x {len(done['voices'])} vozes, {size / 1048576:.1f} MB")


if __name__ == "__main__":
    main()
