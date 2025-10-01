import React from 'react';
import { CommunityDiscussions } from '../../../Components/home/CommunityDiscussions';
import ProtectedPage from "../../../Components/Protected/ProtectedPage"
const  CommunityHub= () => {
    return (
        <div>
         <ProtectedPage>  
           <CommunityDiscussions></CommunityDiscussions> 
            </ProtectedPage> 
        </div>
    );
};

export default CommunityHub ;