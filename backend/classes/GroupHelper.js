const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");
const { v4: uuid } = require("uuid");

class GroupHelper {
  async createGroup(data) {
    return new Promise((resolve, reject) => {
      const query = `
            INSERT INTO VA_Groups(gr_groupSyskey, gr_groupName, gr_createdAt, gr_updatedAt)
            VALUES(?, ?, ?, ?);
            `;
      const params = [uuid(), data.gr_groupName, new Date(), new Date()];
      db.run(query, params, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      });
    });
  }

  async getAllGroups() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM VA_Groups`;
      db.all(query, [], function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  async addMember(data) {
    return new Promise((resolve, reject) => {
      const query = `
            INSERT OR IGNORE INTO VA_GroupMembers(gm_groupSyskey, gm_userSyskey, gm_createdAt)
            VALUES(?, ?, ?);
            `;
      const params = [data.gm_groupSyskey, data.gm_userSyskey, new Date()];
      db.run(query, params, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  async removeMember(groupSyskey, userSyskey) {
    return new Promise((resolve, reject) => {
      const query = `
            DELETE FROM VA_GroupMembers WHERE gm_groupSyskey = ? AND gm_userSyskey = ?
            `;
      db.run(query, [groupSyskey, userSyskey], function (err) {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  async getGroupsForUser(userSyskey) {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT g.* FROM VA_Groups g
            JOIN VA_GroupMembers gm ON gm.gm_groupSyskey = g.gr_groupSyskey
            WHERE gm.gm_userSyskey = ?
            `;
      db.all(query, [userSyskey], function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  async getMembersForGroup(groupSyskey) {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT u.id, u.us_syskey, u.us_username FROM users u
            JOIN VA_GroupMembers gm ON gm.gm_userSyskey = u.us_syskey
            WHERE gm.gm_groupSyskey = ?
            `;
      db.all(query, [groupSyskey], function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
}

module.exports = GroupHelper;
