import jwt from "jsonwebtoken";

// generate jwt token
export function generateJwt(user) {
    const payload = {
        id: user.id,
        username: user.username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRE,
    });
    return token;
}

//verify jwt token
export function verifyJwt(req, res, next) {
    const { authorization } = req.headers;
    try {
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(501).json({
                success: false,
                message: 'Provide Auth Token'
            });
        }
        const token = authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // console.log(decoded)
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: 'Provide Auth Token'
        });
    }
}

export function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Provide Auth Token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded; // attach like express req.user
    next();
  } catch (err) {
    next(new Error("Invalid Token"));
  }
}