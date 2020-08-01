$JAVA_PATH="C:\Program Files\Java\jdk1.8.0_231\bin"
& "${JAVA_PATH}\javac.exe" "-version"
& "${JAVA_PATH}\javac.exe" Main.java
& "${JAVA_PATH}\java.exe" Main $args[0] $args[1] $args[2] $args[3]