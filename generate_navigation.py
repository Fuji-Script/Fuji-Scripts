import os
import pytz
from datetime import datetime

# 设置时区
timezone = pytz.timezone("UTC")
last_updated = datetime.now(timezone).strftime("%Y-%m-%d %H:%M:%S %Z")

# 定义 scripts 目录路径
scripts_dir = "scripts"

# 生成文件导航
def generate_navigation():
    navigation = "## 📂 **Scripts Directory Navigation**\n\n"
    navigation += f"**Last Updated**: {last_updated}\n\n"
    
    for root, dirs, files in os.walk(scripts_dir):
        for file in files:
            file_path = os.path.join(root, file)
            file_stat = os.stat(file_path)
            last_modified = datetime.fromtimestamp(file_stat.st_mtime, timezone).strftime("%Y-%m-%d %H:%M:%S %Z")
            navigation += f"- **[{file}]({file_path})**: Last modified on {last_modified}\n"
    
    return navigation

# 更新 README.md
def update_readme(navigation):
    with open("README.md", "r") as file:
        content = file.read()

    # 替换文件导航部分
    start_marker = "<!-- SCRIPTS_NAVIGATION_START -->"
    end_marker = "<!-- SCRIPTS_NAVIGATION_END -->"
    new_content = content.split(start_marker)[0] + start_marker + "\n" + navigation + "\n" + end_marker + content.split(end_marker)[1]

    with open("README.md", "w") as file:
        file.write(new_content)

if __name__ == "__main__":
    navigation = generate_navigation()
    update_readme(navigation)
