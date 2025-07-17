#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');

class SimpleWebServer {
    constructor(port = 8000) {
        this.port = port;
        this.dataStore = [];
        this.mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.txt': 'text/plain'
        };
    }

    start() {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(this.port, () => {
            console.log('='.repeat(50));
            console.log('🚀 JavaScript 간단 웹서버');
            console.log('='.repeat(50));
            console.log(`🚀 서버가 시작되었습니다!`);
            console.log(`📍 주소: http://localhost:${this.port}`);
            console.log(`📁 현재 디렉토리: ${process.cwd()}`);
            console.log(`⏹️  서버 종료: Ctrl+C`);
            console.log('-'.repeat(50));

            // 브라우저 자동 열기
            this.openBrowser(`http://localhost:${this.port}`);
            console.log('-'.repeat(50));
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`❌ 포트 ${this.port}이 이미 사용 중입니다. 다른 포트를 시도합니다.`);
                this.port++;
                this.start();
            } else {
                console.error(`❌ 서버 시작 오류: ${err.message}`);
            }
        });

        // 종료 처리
        process.on('SIGINT', () => {
            console.log('\n👋 서버가 종료되었습니다.');
            process.exit(0);
        });
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const method = req.method;

        this.logMessage(`${method} ${pathname}`);

        if (method === 'GET') {
            this.handleGet(req, res, parsedUrl);
        } else if (method === 'POST') {
            this.handlePost(req, res, parsedUrl);
        } else {
            this.sendError(res, 405, 'Method Not Allowed');
        }
    }

    handleGet(req, res, parsedUrl) {
        let pathname = parsedUrl.pathname;

        // 루트 경로일 때 quick-game.html로 리다이렉트
        if (pathname === '/') {
            pathname = '/quick-game.html';
        }

        // API 엔드포인트 처리
        if (pathname === '/api/time') {
            this.sendJsonResponse(res, {
                time: new Date().toLocaleString('ko-KR')
            });
            return;
        } else if (pathname === '/api/hello') {
            const name = parsedUrl.query.name || 'World';
            this.sendJsonResponse(res, {
                message: `Hello, ${name}!`
            });
            return;
        } else if (pathname === '/api/data') {
            this.sendJsonResponse(res, {
                data: this.dataStore,
                count: this.dataStore.length
            });
            return;
        }

        // 정적 파일 서빙
        this.serveStaticFile(res, pathname);
    }

    handlePost(req, res, parsedUrl) {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const pathname = parsedUrl.pathname;

                if (pathname === '/api/echo') {
                    this.sendJsonResponse(res, { echo: data });
                } else if (pathname === '/api/save') {
                    // 간단한 데이터 저장 (메모리에만)
                    this.dataStore.push({
                        data: data,
                        timestamp: new Date().toISOString(),
                        id: this.dataStore.length + 1
                    });
                    this.sendJsonResponse(res, {
                        status: 'saved',
                        id: this.dataStore.length
                    });
                } else if (pathname === '/api/game-score') {
                    // 게임 점수 저장
                    const scoreData = {
                        ...data,
                        timestamp: new Date().toISOString(),
                        id: this.dataStore.length + 1
                    };
                    this.dataStore.push(scoreData);
                    this.sendJsonResponse(res, {
                        status: 'score saved',
                        id: scoreData.id
                    });
                } else {
                    this.sendError(res, 404, 'API endpoint not found');
                }
            } catch (error) {
                if (error instanceof SyntaxError) {
                    this.sendError(res, 400, 'Invalid JSON data');
                } else {
                    this.sendError(res, 500, `Server error: ${error.message}`);
                }
            }
        });
    }

    serveStaticFile(res, pathname) {
        // 파일 경로 설정
        const filePath = path.join(process.cwd(), pathname.substring(1));

        // 파일 존재 확인
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                this.sendError(res, 404, `File not found: ${pathname}`);
                return;
            }

            // 파일 읽기
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    this.sendError(res, 500, `Error reading file: ${err.message}`);
                    return;
                }

                // MIME 타입 설정
                const ext = path.extname(filePath).toLowerCase();
                const contentType = this.mimeTypes[ext] || 'text/plain';

                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Content-Length': content.length
                });
                res.end(content);
            });
        });
    }

    sendJsonResponse(res, data) {
        const response = JSON.stringify(data, null, 2);
        const responseBuffer = Buffer.from(response, 'utf8');

        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': responseBuffer.length,
            'Access-Control-Allow-Origin': '*' // CORS 허용
        });
        res.end(responseBuffer);
    }

    sendError(res, statusCode, message) {
        const errorResponse = JSON.stringify({
            error: message,
            statusCode: statusCode,
            timestamp: new Date().toISOString()
        }, null, 2);

        res.writeHead(statusCode, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(errorResponse);
    }

    openBrowser(url) {
        const platform = process.platform;
        let command;

        if (platform === 'win32') {
            command = `start ${url}`;
        } else if (platform === 'darwin') {
            command = `open ${url}`;
        } else {
            command = `xdg-open ${url}`;
        }

        exec(command, (error) => {
            if (error) {
                console.log('💡 브라우저를 수동으로 열어주세요.');
            } else {
                console.log('🌐 브라우저가 자동으로 열렸습니다.');
            }
        });
    }

    logMessage(message) {
        const timestamp = new Date().toLocaleString('ko-KR');
        console.log(`[${timestamp}] ${message}`);
    }
}

// 서버 시작
if (require.main === module) {
    const port = process.argv[2] ? parseInt(process.argv[2]) : 8000;
    const server = new SimpleWebServer(port);
    server.start();
}

module.exports = SimpleWebServer;