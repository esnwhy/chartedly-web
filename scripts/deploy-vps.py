import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('76.13.223.243', username='root', password='Yamax417-123', timeout=10)

def run(cmd, timeout=60):
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out.strip():
        print(out)
    if err.strip():
        print(err)
    return out

print("=== Setting up Chartedly on VPS ===\n")

# 1. Install nginx if needed
print("[1] Checking nginx...")
run("which nginx || apt-get install -y nginx -qq")

# 2. Write nginx config
print("[2] Writing nginx config...")
nginx_conf = r"""server {
    listen 8080;
    server_name _;
    root /opt/chartedly/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
    gzip_min_length 1000;

    location ~* \.(jpg|jpeg|png|gif|webp|svg|ico|css|js|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ $uri/index.html /404.html;
    }

    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;
}
"""
# Write config via heredoc
run(f"cat > /etc/nginx/sites-available/chartedly << 'ENDNGINX'\n{nginx_conf}\nENDNGINX")

# 3. Enable site
print("[3] Enabling site...")
run("ln -sf /etc/nginx/sites-available/chartedly /etc/nginx/sites-enabled/chartedly")
run("rm -f /etc/nginx/sites-enabled/default")

# 4. Test and restart
print("[4] Testing and restarting nginx...")
result = run("nginx -t 2>&1 && systemctl restart nginx && echo OK")
if "OK" not in result:
    print("ERROR: nginx config test failed!")
    sys.exit(1)

# 5. Verify
print("[5] Verifying...")
result = run('curl -s -o /dev/null -w "%{http_code}" http://localhost:8080')
print(f"    HTTP status: {result.strip()}")

print("\n=== Chartedly deployed! ===")
print("    http://76.13.223.243:8080")
print("")

ssh.close()
