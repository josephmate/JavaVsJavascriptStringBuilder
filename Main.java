public class Main {

    public static void main(String [] args) {
        for(int power = 1; power <= 10; power++) {
            int size = (int)Math.pow(10, power);
            runConcatExperiment(size);
            runStringBuilderExperiment(size);
        }
    }

    public static void runConcatExperiment(int size) {
        String result = "";
        long start = System.currentTimeMillis();
        for (int i = 0; i < size; i++) {
            result += (i%10);
        }
        long end = System.currentTimeMillis();
        long duration = end - start;
        System.out.println(String.format("concat %d %d %d", size, result.length(), duration));
    }

    public static void runStringBuilderExperiment(int size) {
        StringBuilder builder = new StringBuilder();
        long start = System.currentTimeMillis();
        for (int i = 0; i < size; i++) {
            builder.append(i%10);
        }
        String result = builder.toString();
        long end = System.currentTimeMillis();
        long duration = end - start;
        System.out.println(String.format("builder %d %d %d", size, result.length(), duration));
    }

}