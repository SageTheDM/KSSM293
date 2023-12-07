// Luca Fabian Burger
// Aufgabe 11

public class App {

    public static void main(String[] args) throws Exception {

        // Dreiecks-Berechnungen nach Pythagoras
        // hypo meint Hypothenuse

        // Dreieck 1
        double seiteA1 = 3;
        double seiteB1 = 4;
        double hypo1 = getHypo(seiteA1, seiteB1);
        printHypo(hypo1, "Erstes Dreieck");

        // Dreieck 2
        double seiteA2 = 4;
        double seiteB2 = 5;
        double hypo2 = getHypo(seiteA2, seiteB2);
        printHypo(hypo2, "Zweites Dreieck");

        // Dreieck 3
        double seiteA3 = 5;
        double seiteB3 = 6;
        double hypo3 = getHypo(seiteA3, seiteB3);
        printHypo(hypo3, "Drittes Dreieck");
    }

    public static double getHypo(double seiteA, double seiteB) {
        return Math.sqrt(seiteA * seiteA + seiteB * seiteB);
    }

    public static void printHypo(double hypo, String myText) {
        System.out.println(myText + ": " + hypo);
    }
}
