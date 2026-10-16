import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <section className="flex items-center justify-center">
      <SignUp
        signInUrl="/auth/sign-in"
        afterSignOutUrl="/auth/sign-in"
        forceRedirectUrl="/"
        oauthFlow="popup"
      />
    </section>
  );
};

export default SignUpPage;
