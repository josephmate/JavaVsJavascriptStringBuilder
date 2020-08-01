$JAVA_PATH="C:\Program Files\Java\jdk-14.0.2\bin"
& "${JAVA_PATH}\javac.exe" "-version"
& "${JAVA_PATH}\javac.exe" Main.java
& "${JAVA_PATH}\java.exe" Main $args[0] $args[1] $args[2] $args[3]