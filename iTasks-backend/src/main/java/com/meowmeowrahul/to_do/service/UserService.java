package com.meowmeowrahul.to_do.service;


import com.meowmeowrahul.to_do.model.Task;
import com.meowmeowrahul.to_do.model.Users;
import com.meowmeowrahul.to_do.repo.TaskRepo;
import com.meowmeowrahul.to_do.repo.UserRepo;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private TaskRepo taskRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authManager;




    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Users register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }



    public String verify(Users user) {



        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(),user.getPassword()));
        if(authentication.isAuthenticated()){
            return jwtService.generateToken(user.getUsername());
        }



        return "Fail";
    }

    public List<Task> getTaskList(String user) {
        return repo.findByUsername(user).getTasks();
    }

    public void addTask(String username,Task task) {
        Users user = repo.findByUsername(username);
        taskRepo.save(task);
        List<Task> newTask = user.getTasks();
        newTask.add(task);
        user.setTasks(newTask);

        repo.save(user);

    }

    public void delTask(String username, int id) {
        Users user = repo.findByUsername(username);

        taskRepo.deleteById(id);

        user.getTasks().removeIf(task -> task.getTaskId() == id);

        repo.save(user);
    }


    public void updateTask(String username, Task updatedTask, int id) {
        Users user = repo.findByUsername(username);

        // Find the task belonging to the user
        Task existingTask = user.getTasks().stream()
                .filter(t -> t.getTaskId() == id)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Update fields on the existing task object
        existingTask.setHeader(updatedTask.getHeader());
        existingTask.setContent(updatedTask.getContent());
        existingTask.setAddedDate(updatedTask.getAddedDate());
        existingTask.setCompleted(updatedTask.isCompleted());
        existingTask.setLabels(updatedTask.getLabels());
        existingTask.setEndDate(updatedTask.getEndDate());
        existingTask.setPriority(updatedTask.getPriority());

        // Save updated task
        taskRepo.save(existingTask);


    }

    public String getUsername(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token="";

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            // If no Authorization header, try to get token from cookies
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if ("token".equals(cookie.getName())) {  // Your cookie name
                        token = cookie.getValue();
                        break;
                    }
                }
            }
        }
        return jwtService.extractUserName(token);
    }

    public List<Task> searchTasks(String value, String username) {
      return taskRepo.searchTask(value,repo.findByUsername(username).getUserid());

    }




    public List<Task> filterIsCompleted() {

        return  taskRepo.findByIsCompleted(true);

    }


    public List<Task> sortToday(String username) {
        return taskRepo.sortToday(repo.findByUsername(username).getUserid(), LocalDate.now());
    }
}
