public class Main {

    public static void main(String [] args) {
        final int base;
        final int powerLimit;

        if(args.length >= 2) {
            base = Integer.parseInt(args[0]);
            powerLimit = Integer.parseInt(args[1]);
        } else {
            base = 2;
            powerLimit = 27;
        }

        for(int power = 1; power <= 27; power++) {
            int size = (int)Math.pow(2, power);
            runConcatExperiment(base, power, size);
            runStringBuilderExperiment(base, power, size);
        }
    }

    public static void runConcatExperiment(int base, int power, int size) {
        String result = "";
        long start = System.currentTimeMillis();
        for (int i = 0; i < size; i++) {
            result += (i%10);
        }
        long end = System.currentTimeMillis();
        long duration = end - start;
        System.out.println(String.format("concat %d^%d %d %d %d", base, power, size, result.length(), duration));
    }

    public static void runStringBuilderExperiment(int base, int power, int size) {
        StringBuilder builder = new StringBuilder();
        long start = System.currentTimeMillis();
        for (int i = 0; i < size; i++) {
            builder.append(i%10);
        }
        String result = builder.toString();
        long end = System.currentTimeMillis();
        long duration = end - start;
        System.out.println(String.format("builder %d^%d %d %d %d", base, power, size, result.length(), duration));
    }

}