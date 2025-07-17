#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import http.server
import socketserver
import webbrowser
import os
import json
from urllib.parse import urlparse, parse_qs
from datetime import datetime

class SimpleWebHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # URL 파싱
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # 루트 경로일 때 index.html로 리다이렉트
        if path == '/':
            path = '/index.html'
        
        # API 엔드포인트 처리
        if path == '/api/time':
            self.send_json_response({'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')})
            return
        elif path == '/api/hello':
            query_params = parse_qs(parsed_path.query)
            name = query_params.get('name', ['World'])[0]
            self.send_json_response({'message': f'Hello, {name}!'})
            return
        
        # 정적 파일 서빙
        try:
            # 파일 경로 설정
            file_path = path.lstrip('/')
            if not file_path:
                file_path = 'index.html'
            
            # 파일 존재 확인
            if os.path.exists(file_path):
                # MIME 타입 설정
                if file_path.endswith('.html'):
                    content_type = 'text/html; charset=utf-8'
                elif file_path.endswith('.css'):
                    content_type = 'text/css'
                elif file_path.endswith('.js'):
                    content_type = 'application/javascript'
                elif file_path.endswith('.json'):
                    content_type = 'application/json'
                else:
                    content_type = 'text/plain'
                
                # 파일 읽기 및 응답
                with open(file_path, 'rb') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-type', content_type)
                self.send_header('Content-length', len(content))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, f'File not found: {file_path}')
                
        except Exception as e:
            self.send_error(500, f'Server error: {str(e)}')
    
    def do_POST(self):
        # POST 요청 처리
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            # JSON 데이터 파싱
            data = json.loads(post_data.decode('utf-8'))
            
            # API 엔드포인트별 처리
            if self.path == '/api/echo':
                self.send_json_response({'echo': data})
            elif self.path == '/api/save':
                # 간단한 데이터 저장 (메모리에만)
                if not hasattr(self.server, 'data_store'):
                    self.server.data_store = []
                self.server.data_store.append({
                    'data': data,
                    'timestamp': datetime.now().isoformat()
                })
                self.send_json_response({'status': 'saved', 'id': len(self.server.data_store)})
            else:
                self.send_error(404, 'API endpoint not found')
                
        except json.JSONDecodeError:
            self.send_error(400, 'Invalid JSON data')
        except Exception as e:
            self.send_error(500, f'Server error: {str(e)}')
    
    def send_json_response(self, data):
        """JSON 응답 전송"""
        response = json.dumps(data, ensure_ascii=False, indent=2)
        response_bytes = response.encode('utf-8')
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.send_header('Content-length', len(response_bytes))
        self.send_header('Access-Control-Allow-Origin', '*')  # CORS 허용
        self.end_headers()
        self.wfile.write(response_bytes)
    
    def log_message(self, format, *args):
        """로그 메시지 출력"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def start_server(port=8000):
    """웹서버 시작"""
    try:
        with socketserver.TCPServer(("", port), SimpleWebHandler) as httpd:
            print(f"🚀 서버가 시작되었습니다!")
            print(f"📍 주소: http://localhost:{port}")
            print(f"📁 현재 디렉토리: {os.getcwd()}")
            print(f"⏹️  서버 종료: Ctrl+C")
            print("-" * 50)
            
            # 브라우저 자동 열기
            try:
                webbrowser.open(f'http://localhost:{port}')
                print("🌐 브라우저가 자동으로 열렸습니다.")
            except:
                print("💡 브라우저를 수동으로 열어주세요.")
            
            print("-" * 50)
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n👋 서버가 종료되었습니다.")
    except OSError as e:
        if e.errno == 10048:  # 포트가 이미 사용 중
            print(f"❌ 포트 {port}이 이미 사용 중입니다. 다른 포트를 시도합니다.")
            start_server(port + 1)
        else:
            print(f"❌ 서버 시작 오류: {e}")

if __name__ == "__main__":
    print("=" * 50)
    print("🐍 Python 간단 웹서버")
    print("=" * 50)
    start_server()