import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <section className="flex items-center justify-center">
      <SignIn
        signUpUrl="/auth/sign-up"
        signInUrl="/auth/sign-in"
        afterSignOutUrl="/auth/sign-in"
        forceRedirectUrl="/"
        oauthFlow="popup"
      />
    </section>
  );
};

export default SignInPage;
