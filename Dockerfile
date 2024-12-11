FROM node:18

WORKDIR /usr/src/app

# package.json과 관련 설정 파일들 복사
COPY package*.json ./
COPY tsconfig.json ./

# 의존성 설치 (devDependencies 포함)
RUN npm install

# 전체 소스 코드와 .env 파일 복사
COPY . .

EXPOSE 8001

# 개발 모드로 실행 (nodemon 사용)
CMD ["npm", "run", "dev"]