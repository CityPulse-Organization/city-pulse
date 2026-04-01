package city.pulse.mobile;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class MobileBffServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MobileBffServiceApplication.class, args);
    }
}
