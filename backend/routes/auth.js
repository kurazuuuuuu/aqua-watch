const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

// GitHub OAuth認証開始
router.get('/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  // 環境に応じてリダイレクトURIを設定
  let redirectUri;
  const host = req.get('host');
  
  if (host && host.includes('aqua-watch.krz-tech.net')) {
    redirectUri = 'https://aqua-watch.krz-tech.net/api/auth/github/callback';
  } else {
    redirectUri = 'http://localhost:11101/api/auth/github/callback';
  }
  
  const scope = 'user:email';
  
  console.log('GitHub認証開始:', { host, redirectUri });
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  
  res.redirect(githubAuthUrl);
});

// GitHub OAuth コールバック
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect('/admin?error=auth_failed');
  }
  
  try {
    // アクセストークンを取得
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
    }, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const accessToken = tokenResponse.data.access_token;
    
    if (!accessToken) {
      return res.redirect('/admin?error=token_failed');
    }
    
    // ユーザー情報を取得
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${accessToken}`,
      },
    });
    
    const user = userResponse.data;
    
    // Organization メンバーシップを確認
    let isOrgMember = false;
    try {
      // パブリックメンバーシップを確認
      const orgResponse = await axios.get(`https://api.github.com/orgs/Krz-Tech/public_members/${user.login}`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        },
      });
      isOrgMember = orgResponse.status === 204;
    } catch (error) {
      console.log('Public membership check failed, trying user orgs:', error.response?.status);
      
      // パブリックメンバーシップが見つからない場合、ユーザーの所属組織を確認
      try {
        const userOrgsResponse = await axios.get('https://api.github.com/user/orgs', {
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
          },
        });
        
        isOrgMember = userOrgsResponse.data.some(org => org.login === 'Krz-Tech');
        console.log('User organizations check:', isOrgMember);
      } catch (orgError) {
        console.log('User orgs check failed:', orgError.response?.status);
        isOrgMember = false;
      }
    }
    
    console.log('User authenticated:', {
      login: user.login,
      name: user.name,
      isOrgMember: isOrgMember
    });
    
    // JWTトークンを生成
    const token = jwt.sign(
      { 
        id: user.id, 
        login: user.login, 
        name: user.name,
        avatar_url: user.avatar_url,
        is_org_member: isOrgMember
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // トークンをクッキーに設定してリダイレクト
    const isProduction = req.get('host') && req.get('host').includes('aqua-watch.krz-tech.net');
    
    res.cookie('admin_token', token, { 
      httpOnly: true, 
      secure: isProduction, // プロダクションではHTTPS必須
      sameSite: isProduction ? 'lax' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24時間
    });
    
    res.redirect('/admin');
    
  } catch (error) {
    console.error('GitHub認証エラー:', error);
    res.redirect('/admin?error=auth_error');
  }
});

// 認証確認
router.get('/verify', (req, res) => {
  const token = req.cookies.admin_token;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ログアウト
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
});

module.exports = router;
