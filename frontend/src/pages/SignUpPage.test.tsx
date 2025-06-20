import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from './SignUpPage';

// 'describe' groups related tests together into a test suite
describe('SignUpPage Component', () => {
    
    // 'it' defines an individual test case with a description of what the component should od
    it('should render the main heading, form fields, and submit button', () => {
        // Arrange: render the component we want to test
        // We wrap it in BrowserRouter because React Router hooks migth be used inside 
        render(
            <BrowserRouter>
            <SignUpPage />
            </BrowserRouter>
        );

        // Act: nothing to do here since we are just rendering
        // Assert : check if the expected elements are in the document. 
        // 'screen' is an object from React Testing Library that lets us query the DOM
        expect(screen.getByRole('heading', { name: /create your account/i})).toBeInTheDocument();

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

});