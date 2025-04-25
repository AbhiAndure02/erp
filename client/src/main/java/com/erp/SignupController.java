package com.erp;

import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.input.KeyCode;

public class SignupController {
    @FXML
    private TextField userNameField;

    @FXML
    private TextField nameField;

    @FXML
    private TextField emailField;

    @FXML
    private PasswordField passwordField;
    @FXML    
    private Label errorLabel;


    @FXML
    private void initialize() {
        // Add enter key support
        passwordField.setOnKeyPressed(event -> {
            if (event.getCode() == KeyCode.ENTER) {
                handleSignup();
            }
        });
    }

    @FXML
    private void handleSignup(){
        String name = nameField.getText().trim();
        String pass = passwordField.getText().trim();
        String username = userNameField.getText().trim();
        String email = emailField.getText().trim();

        if(name.isEmpty() || email.isEmpty() || username.isEmpty() || pass.isEmpty()){
            
             showError("all fields are required");
             return;

        }
        else{
            showSuccess("user register success");
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
    
}
