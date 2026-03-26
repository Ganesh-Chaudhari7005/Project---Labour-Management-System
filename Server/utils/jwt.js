import jwt from 'jsonwebtoken';

const SECRET = 'ROYAL@7005';

function generateToken(user){
    return jwt.sign(
        {
            email : user.email,
            role : user.role
        },
        SECRET,
        {expiresIn: "2h"}
    );
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

export default generateToken;