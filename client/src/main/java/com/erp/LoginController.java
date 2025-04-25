package com.erp;

import java.io.IOException;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.stage.Stage;

public class LoginController {

    @FXML
    private TextField usernameField;

    @FXML
    private PasswordField passwordField;

    @FXML
    private Label errorLabel;

    @FXML
    private void initialize() {
        // Add enter key support
        passwordField.setOnKeyPressed(event -> {
            if (event.getCode() == KeyCode.ENTER) {
                handleLogin();
            }
        });
    }

    @FXML
    private void handleLogin() {
        String user = usernameField.getText().trim();
        String pass = passwordField.getText().trim();

        if (user.isEmpty() || pass.isEmpty()) {
            showError("Please enter both username and password");
            return;
        }

        // Simulate authentication
        if ("admin".equals(user) && "password".equals(pass)) {
            showSuccess("Login Successful! Redirecting...");
            // Here you would typically transition to the main application screen
        } else {
            showError("Invalid credentials. Please try again.");
        }
    }

    private void showError(String message) {
        errorLabel.setText(message);
        errorLabel.getStyleClass().remove("success-label");
        errorLabel.getStyleClass().add("error-label");
    }

    private void showSuccess(String message) {
        errorLabel.setText(message);
        errorLabel.getStyleClass().remove("error-label");
        errorLabel.getStyleClass().add("success-label");
    }
@FXML
private void changeToSignup() {
    try {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("signup.fxml"));
        Parent root = loader.load();

        // Get current stage from any node (e.g. a button)
        Stage stage = (Stage) usernameField.getScene().getWindow();
        Scene scene = new Scene(root);
        stage.setScene(scene);
        stage.setTitle("Sign Up");
        stage.show();

    } catch (IOException e) {
        e.printStackTrace();
    }
}

}