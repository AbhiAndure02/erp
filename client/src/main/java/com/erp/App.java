package com.erp;

import java.io.IOException;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.input.KeyCode;
import javafx.stage.Stage;
 
public class App extends Application {
 
    private Stage primaryStage;

    @Override
    public void start(Stage stage) throws Exception {
        this.primaryStage = stage;
        loadScene();
        stage.show();
    }

    private void loadScene() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("login.fxml"));
            Parent root = loader.load();
            Scene scene = new Scene(root);

            // 🔁 Hot Reload on F5 key
            scene.setOnKeyPressed(event -> {
                if (event.getCode() == KeyCode.F5) {
                    reloadScene();
                }
            });

            primaryStage.setScene(scene);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void reloadScene() {
        System.out.println("🔁 Reloading FXML...");
        loadScene(); // Just reloads the scene again
    }

    public static void main(String[] args) {
        launch();
    }
}
