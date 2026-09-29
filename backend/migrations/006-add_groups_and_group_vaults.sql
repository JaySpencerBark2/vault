CREATE TABLE IF NOT EXISTS VA_Groups (
    grid_groups INTEGER PRIMARY KEY AUTOINCREMENT,
    gr_groupSyskey VARCHAR(50) NOT NULL,
    gr_groupName VARCHAR(100) NOT NULL,
    gr_createdAt DATE NOT NULL,
    gr_updatedAt DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS VA_GroupMembers (
    gmid_groupmembers INTEGER PRIMARY KEY AUTOINCREMENT,
    gm_groupSyskey VARCHAR(50) NOT NULL,
    gm_userSyskey VARCHAR(50) NOT NULL,
    gm_createdAt DATE NOT NULL,
    UNIQUE(gm_groupSyskey, gm_userSyskey)
);

ALTER TABLE VA_VaultHeader ADD COLUMN vh_groupSyskey VARCHAR(50) DEFAULT NULL;
