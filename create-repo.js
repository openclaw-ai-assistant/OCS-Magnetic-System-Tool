const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 OCS Magnetic System Tool - GitHub 仓库创建工具');
console.log('=================================================\n');

// 提示用户输入
token = 'YOUR_GITHUB_TOKEN';

const createRepo = () => {
  const data = JSON.stringify({
    name: 'OCS-Magnetic-System-Tool',
    description: 'Advanced magnetic sensor simulation and design platform',
    private: false,
    auto_init: true
  });

  const options = {
    hostname: 'api.github.com',
    path: '/user/repos',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': `token ${token}`,
      'User-Agent': 'OCS-Magnetic-Tool'
    }
  };

  console.log('📦 正在创建仓库...\n');

  const req = https.request(options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      const response = JSON.parse(responseData);

      if (res.statusCode === 201) {
        console.log('✅ 仓库创建成功！');
        console.log('==================');
        console.log(`📁 仓库名: ${response.name}`);
        console.log(`🔗 URL: ${response.html_url}`);
        console.log(`📝 描述: ${response.description}`);
        console.log('\n🎉 接下来请运行:');
        console.log('cd /home/node/clawd/projects/ocs-magnetic-system-tool');
        console.log('./final-push.sh');
      } else if (res.statusCode === 401) {
        console.log('❌ 认证失败');
        console.log('请检查 GitHub Token 是否正确');
      } else if (res.statusCode === 422) {
        console.log('⚠️  仓库可能已存在');
        console.log('请直接运行推送脚本:');
        console.log('./final-push.sh');
      } else {
        console.log(`❌ 错误: ${res.statusCode}`);
        console.log(response.message);
      }

      rl.close();
    });
  });

  req.on('error', (error) => {
    console.error('❌ 请求失败:', error.message);
    rl.close();
  });

  req.write(data);
  req.end();
};

// 主流程
console.log('请提供 GitHub Personal Access Token');
console.log('获取方式:');
console.log('1. 访问 https://github.com/settings/tokens');
console.log('2. 点击 "Generate new token (classic)"');
console.log('3. 勾选 "repo" 权限');
console.log('4. 生成并复制 token\n');

rl.question('🔑 请输入 GitHub Token: ', (input) => {
  token = input.trim();
  
  if (!token || token === 'YOUR_GITHUB_TOKEN') {
    console.log('\n❌ 请提供有效的 GitHub Token');
    rl.close();
    return;
  }

  createRepo();
});
