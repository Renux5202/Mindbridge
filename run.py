import subprocess
import sys
import os
import signal

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root, "backend")
    frontend_dir = os.path.join(root, "frontend")

    print("=" * 60)
    print("🌿 Starting MindBridge: Full-Stack App")
    print("=" * 60)
    print("👉 Backend API will be available at:  http://localhost:8000")
    print("👉 Frontend UI will be available at:  http://localhost:5173")
    print("👉 Press Ctrl+C at any time to stop both servers.")
    print("=" * 60)

    # Launch Backend
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--reload", "--port", "8000"],
        cwd=backend_dir
    )

    # Launch Frontend
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=frontend_dir
    )

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping MindBridge servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Done. Goodbye!")

if __name__ == "__main__":
    main()
