import React, { useContext } from 'react';
import {
   UseUserContextType,
   UserContext,
} from '../../../contexts/UserProvider';

export default function useUser(): UseUserContextType {
   return useContext(UserContext);
}
