package com.erp.erp;

import java.util.HashMap;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ErpController {
    // This is a placeholder for the ERP controller class.
    // You can add methods and properties to handle ERP-related operations.
@GetMapping("/api/erp")
@ResponseBody
 public HashMap<Integer, String> getErpData() {
        // This method would handle the request to get ERP data.
        HashMap<Integer, String> data = new HashMap<>();
        data.put(1, "abhishek");
        data.put(2, "namdev");
        data.put(3, "gopal");
        data.put(4, "vishwas");
        data.put(5, "sachin");
        data.put(6, "sagar");
        data.put(11, "siddharth");
        return data;
    } 
}
