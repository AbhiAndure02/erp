package com.erp.erp.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users") // MongoDB collection name
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String role;
    private String name;
    private String email;
    private boolean isAdmin;

    // Getters and Setters
    public String getId() {
         return id; 
        }

    public void setId(String id) {
         this.id = id; 
        }

    public String getName() {
         return name; 
        }

    public void setName(String name) {
         this.name = name; 
        }

    public String getEmail() {
         return email; 
        }

    public void setEmail(String email) {
         this.email = email; 
        }
    public String getUsername() {
         return username; 
        }

    public void setUsername(String username) {
         this.username = username; 
        }

    public String getPassword() {
         return password; 
        }

    public void setPassword(String password) {
         this.password = password; 
        }

    public String getRole() {
         return role; 
        }
        
    public void setRole(String role) {
         this.role = role; 
        }
    public boolean isAdmin() {
         return isAdmin; 
        }
    public void setAdmin(boolean isAdmin) {
         this.isAdmin = isAdmin; 
        }
}
