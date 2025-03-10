package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import ma.Nabil.SyndicNow.enums.Role;

@Entity
@Table(name = "admins")
@DiscriminatorValue("ADMIN")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Admin extends User {
    
    @PrePersist
    public void onCreateAdmin() {
        if (getRole() == null) {
            setRole(Role.ADMIN);
        }
    }
} 