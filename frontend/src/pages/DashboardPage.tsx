import {useState} from 'react';
import CreateGoalForm from '../components/goals/CreateGoalForm';

const DashboardPage = () => {
    const [ showCreateForm, setShowCreateForm ] = useState(false);

const handleGoalCreated = () => {
    console.log("Goal has been created, hiding form " );
    setShowCreateForm(false);
    // Future implementation: Trigger a refresh of the goals list
}


    return (
        <div>
            <h1>Welcome to your dashboard</h1>
            <p>This is where you can manage your goals</p>
        
            <hr />

            {/* Conditonally render form based on state */}
            {showCreateForm ? (
                <CreateGoalForm onGoalCreated={handleGoalCreated}/>
            ) : (
                <button onClick={() => setShowCreateForm(true)}>
                + Create New Goal
                </button>
            )}

        </div>
    );
};

export default DashboardPage;