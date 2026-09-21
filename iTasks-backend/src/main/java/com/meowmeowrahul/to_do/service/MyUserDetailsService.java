package com.meowmeowrahul.to_do.service;


import com.meowmeowrahul.to_do.model.UserPrincipal;
import com.meowmeowrahul.to_do.model.Users;
import com.meowmeowrahul.to_do.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = repo.findByUsername(username);
        if(user == null){
            System.out.println("User Not found");
            throw new UsernameNotFoundException("User Not Found");
        }
        return new UserPrincipal(user);
    }


}
