"""Serve the complete static reader; no dependencies or AI calls."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
from functools import partial
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8000);parser.add_argument('--host',default='127.0.0.1');args=parser.parse_args()
folder=Path(__file__).resolve().parent/'dist';print(f'Open http://{args.host}:{args.port}/',flush=True)
ThreadingHTTPServer((args.host,args.port),partial(SimpleHTTPRequestHandler,directory=str(folder))).serve_forever()
