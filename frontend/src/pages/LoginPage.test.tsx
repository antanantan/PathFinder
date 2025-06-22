import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

describe('LoginPage Component', () => {

    it('should render the main heading, form fields, and submit button', () => {
        //arrange
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        //assert
        expect(screen.getByRole('heading', { name: /log in to your account/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();

    });
});    