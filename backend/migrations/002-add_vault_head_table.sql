 CREATE TABLE IF NOT EXISTS VA_VaultHeader (
                    vhid_vaultheader INTEGER PRIMARY KEY AUTOINCREMENT,
                    vh_vaultheadSyskey VARCHAR(50) NOT NULL,
                    vh_vaultName VARCHAR(50) NOT NULL,
                    vh_vaultPassword VARCHAR(50) NOT NULL,
                    vh_userSyskey VARCHAR(50) NOT NULL,
                    vh_createdAt DATE NOT NULL,
                    vh_updatedAt DATE NOT NULL
                );