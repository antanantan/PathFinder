'use client';

import { useActionState, useEffect } from 'react';
import { createGoalAction } from '../../actions';

const initialState = {
    error: null,
    success: false,
}

// This component's props have a callback function that allows it to communicate with its parent component upon successful form submission
interface CreateGoalFormProps {
    onGoalCreated: () => void;
}

// Form component for creating a new goal. Self-contained and uses a server action to submit data. It notifies its parent component via 'onGoalCreated' prop upon success
const CreateGoalForm = ({ onGoalCreated }: CreateGoalFormProps) => {
    const [state, submitAction, isPending] = useActionState(createGoalAction, initialState);

    // useEffect to listen for 'success' flag from the server action
    // when true it triggers the 'onGoalCreated' callback to let the parent component know it can perform an action (e.g. close the form)
    useEffect(() => {
        if (state.success) {
            onGoalCreated();
        }
    }, [state.success, onGoalCreated]);

    return(
        <form action ={submitAction}>
            <h3>New Goal</h3>
            <div>
                <label htmlFor="title">Title</label>
                <input id="title" name="title" type="text" placeholder="What's your goal?" required />
            </div>
            <div>
                <label htmlFor="description">Description (Optional)</label>
                <input id="description" name="description" type="text" placeholder="Add some details..." />
            </div>
            <button type="submit" disabled={isPending}>
                {isPending ? 'Saving Goal...' : 'Save Goal'}
            </button>

            {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
        </form>
    );

};

export default CreateGoalForm;