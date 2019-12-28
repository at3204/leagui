import React from 'react';
import DashboardNav from '../Components/admin/nav/DashboardNav';

const DashboardLayout = (props) => {
    return (
        <div className="admin_container">
            <div className="admin_left_nav">
                <DashboardNav {...props}/>
            </div>
            <div className="admin_right">
                {props.children}
            </div>
        </div>
    )
}

export default DashboardLayout
