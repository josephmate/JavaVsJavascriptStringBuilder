public class Test {
    public static void main(String [] args) {
        String result = "";
        for (int i = 0; i < 1000000000; i++) {
            result += (i%10);
        }
        System.out.println(result.length() + "");
    }
}