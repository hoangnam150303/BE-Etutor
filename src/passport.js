const passport = require("passport");
const GoogleStrategy = require("passport-google-token").Strategy;
const users = require("./models/users");

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GG_CLIENTID,
      clientSecret: process.env.GG_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, name, emails } = profile;
        const { familyName, givenName } = name;
        const email = emails[0].value;
        const avatar = profile._json.picture || "";        
        // Kiểm tra người dùng có tồn tại không
        let user = await users.findOne({
          authProvider: "google",
          email: email,
        });

        if (!user) {
          // Tạo người dùng mới
          user = new users({
            email,
            username: `${familyName} ${givenName}`,
            lastLogin: new Date(),
            status: true,
            authProvider: "google",
            googleId: id,
            avatar: avatar,
            role: "Student",
          });
        }
        // Cập nhật thời gian đăng nhập
        user.lastLogin = Date.now();
        await user.save();
        done(null, user); // Tiếp tục tới bước kế tiếp
      } catch (error) {
        console.error("Error in GoogleStrategy:", error.message);
        done(error, null);
      }
    }
  )
);




module.exports = passport;
