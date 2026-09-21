package com.meowmeowrahul.to_do.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:}")
    private String dbUrl;

    @Value("${spring.datasource.username:}")
    private String dbUsername;

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariDataSource dataSource = new HikariDataSource();

        String rawUrl = dbUrl;
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getenv("DATABASE_URL");
        }
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = System.getenv("DATASOURCE_URL");
        }

        String username = dbUsername;
        if (username == null || username.isBlank()) {
            username = System.getenv("DATASOURCE_USER");
        }

        String password = dbPassword;
        if (password == null || password.isBlank()) {
            password = System.getenv("DATASOURCE_PASSWORD");
        }

        if (rawUrl != null && !rawUrl.isBlank()) {
            rawUrl = rawUrl.trim();

            // Convert postgres:// or postgresql:// to jdbc:postgresql://
            if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
                try {
                    URI uri = new URI(rawUrl);
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath(); // includes leading '/'

                    if (uri.getUserInfo() != null && !uri.getUserInfo().isBlank()) {
                        String[] userInfo = uri.getUserInfo().split(":", 2);
                        if ((username == null || username.isBlank()) && userInfo.length > 0) {
                            username = userInfo[0];
                        }
                        if ((password == null || password.isBlank()) && userInfo.length > 1) {
                            password = userInfo[1];
                        }
                    }

                    rawUrl = "jdbc:postgresql://" + host + ":" + port + path;
                } catch (Exception e) {
                    log.warn("URI parsing failed for database URL, falling back to regex: {}", e.getMessage());
                    // Fallback string extraction if URI constructor rejects special characters in password
                    String stripped = rawUrl.replaceFirst("^postgres(ql)?://", "");
                    if (stripped.contains("@")) {
                        int atIndex = stripped.indexOf('@');
                        String userPass = stripped.substring(0, atIndex);
                        String hostAndPath = stripped.substring(atIndex + 1);

                        if (userPass.contains(":")) {
                            String[] parts = userPass.split(":", 2);
                            if (username == null || username.isBlank()) username = parts[0];
                            if (password == null || password.isBlank()) password = parts[1];
                        } else if (username == null || username.isBlank()) {
                            username = userPass;
                        }
                        rawUrl = "jdbc:postgresql://" + hostAndPath;
                    } else {
                        rawUrl = "jdbc:postgresql://" + stripped;
                    }
                }
            } else if (!rawUrl.startsWith("jdbc:")) {
                rawUrl = "jdbc:postgresql://" + rawUrl;
            }
        } else {
            // Fallback for local development
            rawUrl = "jdbc:postgresql://localhost:5432/itasks";
        }

        log.info("Configuring Hikari DataSource with JDBC URL: {}", rawUrl);

        dataSource.setJdbcUrl(rawUrl);

        if (username != null && !username.isBlank()) {
            dataSource.setUsername(username);
        }
        if (password != null && !password.isBlank()) {
            dataSource.setPassword(password);
        }

        if (rawUrl.contains("postgresql")) {
            dataSource.setDriverClassName("org.postgresql.Driver");
        } else if (rawUrl.contains("mysql")) {
            dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        }

        // Optimized pool settings for cloud free tiers (e.g. Render 512MB RAM)
        dataSource.setMaximumPoolSize(5);
        dataSource.setMinimumIdle(1);
        dataSource.setIdleTimeout(30000);
        dataSource.setMaxLifetime(600000);
        dataSource.setConnectionTimeout(30000);

        return dataSource;
    }
}
