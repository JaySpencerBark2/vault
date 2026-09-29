CREATE TABLE IF NOT EXISTS VA_VaultLines (
    vlid_vaultlines INTEGER PRIMARY KEY AUTOINCREMENT,
    vl_vaultheaderSyskey VARCHAR(50) NOT NULL,
    vl_lineSyskey VARCHAR(50) NOT NULL,
    vl_lineName VARCHAR(50) NOT NULL,
    vl_lineContent VARCHAR(50) NOT NULL,
    vl_createdAt DATE NOT NULL,
    vl_updatedAt DATE NOT NULL
);