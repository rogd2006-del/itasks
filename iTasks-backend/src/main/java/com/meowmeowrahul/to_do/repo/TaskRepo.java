package com.meowmeowrahul.to_do.repo;


import com.meowmeowrahul.to_do.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepo extends JpaRepository<Task,Integer> {

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN t.labels label WHERE t.user.userid = :userId AND " +
            "(LOWER(t.header) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(t.content) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(label) LIKE LOWER(CONCAT('%', :keyword, '%')) ) ")
    List<Task> searchTask(@Param("keyword") String keyword, @Param("userId") int userId);


    List<Task> findByIsCompleted(boolean isCompleted);

    @Query("SELECT DISTINCT t FROM Task t where t.user.id = :userid AND "+
           "t.endDate = :today")
    List<Task> sortToday(int userid , LocalDate today);
}
