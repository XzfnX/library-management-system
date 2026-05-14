# Java 21 安装指南

## 方法一：手动下载安装（推荐）

### 步骤1：下载 Java 21

访问以下链接下载 Eclipse Temurin JDK 21：

**Windows x64 版本：**
```
https://adoptium.net/temurin/releases/?version=21&os=windows&arch=x64&package=jdk
```

或者直接下载 ZIP 包：
```
https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.5%2B11/OpenJDK21U-jdk_x64_windows_hotspot-21.0.5_11.zip
```

### 步骤2：解压到合适的位置

例如：`C:\Program Files\Java\jdk-21`

### 步骤3：设置环境变量

打开系统属性 → 高级 → 环境变量

**新增系统变量：**
```
变量名：JAVA_HOME_21
变量值：C:\Program Files\Java\jdk-21
```

**修改 PATH 变量：**
将 `%JAVA_HOME_21%\bin` 添加到 PATH 最前面

### 步骤4：验证安装

打开新的命令提示符窗口，执行：

```bash
C:\> "%JAVA_HOME_21%\bin\java.exe" -version
```

应该显示：
```
openjdk version "21.0.5" 2024-10-15
OpenJDK Runtime Environment (Temurin-21+11) (build 21.0.5+11)
OpenJDK 64-Bit Server VM (build 21.0.5+11, mixed mode)
```

## 方法二：使用Chocolatey（如果已安装）

```bash
choco install openjdk21 -y
```

## 方法三：使用Scoop（如果已安装）

```bash
scoop install openjdk21
```

## 切换Java版本

安装完成后，你可以创建快捷脚本来切换Java版本：

### 切换到 Java 21：
```batch
@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-21
set PATH=%JAVA_HOME%\bin;%PATH%
echo 已切换到 Java 21
java -version
```

### 切换回 Java 26：
```batch
@echo off
set JAVA_HOME=C:\Program Files\Java\latest
set PATH=%JAVA_HOME%\bin;%PATH%
echo 已切换回 Java 26
java -version
```

## 启动后端

设置好 JAVA_HOME 为 Java 21 后，执行：

```bash
cd library-backend
mvn clean compile exec:java
```

## 常见问题

Q: 下载太慢怎么办？
A: 可以使用国内镜像，如：
- 华为镜像：https://mirrors.huaweicloud.com/openjdk/
- 腾讯镜像：https://mirrors.cloud.tencent.com/openjdk/

Q: 如何查看当前使用的Java版本？
A: 执行 `where java` 可以看到当前PATH中的java位置
