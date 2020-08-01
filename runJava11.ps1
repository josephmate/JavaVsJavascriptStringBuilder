$JAVA_PATH="C:\Program Files\Java\jdk-11.0.8\bin"
& "${JAVA_PATH}\javac.exe" "-version"
& "${JAVA_PATH}\javac.exe" Main.java
& "${JAVA_PATH}\java.exe" Main $args[0] $args[1] $args[2] $args[3]