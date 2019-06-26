import jwt from 'jsonwebtoken';

const getUserID = (request, requireAuth = true) => {
    const header = request.request.headers.authorization

    if (header){
        const token = header.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisisasecretkey');
        return decoded.userId;    
    }

    if(requireAuth){
        throw new Error('Authentication required');
    }

    return null;
}

export { getUserID as default }