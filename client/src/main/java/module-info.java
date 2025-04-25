module com.erp {
    requires javafx.controls;
    requires javafx.fxml;

    opens com.erp to javafx.fxml;
    exports com.erp;
}
