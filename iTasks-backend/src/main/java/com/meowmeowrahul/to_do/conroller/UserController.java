package com.meowmeowrahul.to_do.conroller;


import com.meowmeowrahul.to_do.model.Task;
import com.meowmeowrahul.to_do.model.Users;
import com.meowmeowrahul.to_do.service.JwtService;
import com.meowmeowrahul.to_do.service.MyUserDetailsService;
import com.meowmeowrahul.to_do.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private JwtService jwtService;

    @Autowired
    ApplicationContext context;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/check-token")
    public String checkToken(HttpServletRequest request){
        return service.getUsername(request);
    }



    @PostMapping("/register")
    public Users register(@RequestBody Users user){
        return service.register(user);
    }


    @GetMapping("/logout")
    public ResponseEntity<HttpStatus> logout(HttpServletResponse response){
        Cookie cookie = new Cookie("token",null);
        cookie.setHttpOnly(true);            // Prevent JavaScript access
        cookie.setSecure(true);             // Use true in production with HTTPS
        cookie.setPath("/");                 // Cookie valid for the entire domain
        cookie.setMaxAge(0);   //instant expire
        try{
        response.addCookie(cookie);
        return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }



    }

    @PostMapping("/login")
    public String login(@RequestBody Users user, HttpServletResponse response,HttpServletRequest request){
        String token ="";
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("token".equals(cookie.getName())) {  // Your cookie name
                    token = cookie.getValue();
                    break;
                }
            }
        }

        UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(user.getUsername());

        if(jwtService.validateToken(token,userDetails)) return "Login SuccessFul";

        token = service.verify(user);  // Generates JWT token on successful verification

        // Create HttpOnly cookie with the JWT token
        Cookie cookie = new Cookie("token",token);
        cookie.setHttpOnly(true);            // Prevent JavaScript access
        cookie.setSecure(true);             // Use true in production with HTTPS
        cookie.setPath("/");                 // Cookie valid for the entire domain
        cookie.setMaxAge(24 * 60 * 60);     // Expiration time: 1 day

        response.addCookie(cookie);
                                        // Add cookie to response
        System.out.println("Login Successful");
        return "Login successful";            // Return a simple success message instead of token
    }




    @GetMapping("/tasks")
    public List<Task> getAllTasks(){
        return service.getTaskList(getCurrentUsername());
    }




    @PostMapping("/tasks")
    public void addTask(@RequestBody Task task){
        service.addTask(getCurrentUsername(),task);
    }

    @DeleteMapping("/tasks/{id}")
    public void delTask(@PathVariable int id){

        service.delTask(getCurrentUsername(),id);
    }

    @PutMapping("/tasks/{id}")
    public void updateTask(@PathVariable int id,@RequestBody Task task){
        service.updateTask(getCurrentUsername(),task,id);
    }

    @GetMapping("/tasks/search/{value}")
    public ResponseEntity<List<Task>> searchTasks(@PathVariable String value){
        List<Task> taskList = service.searchTasks(value,getCurrentUsername());
        if(taskList.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        else return new ResponseEntity<>(taskList,HttpStatus.OK);
    }



    @GetMapping("tasks/sort/today")
    public ResponseEntity<List<Task>> sortToday(){
        List<Task> taskList = service.sortToday(getCurrentUsername());
        if(taskList.isEmpty())
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        else return new ResponseEntity<>(taskList,HttpStatus.OK);
    }


    @GetMapping("tasks/filter/completed")
    public List<Task> filterIsCompleted(){

        return service.filterIsCompleted();
    }






}
