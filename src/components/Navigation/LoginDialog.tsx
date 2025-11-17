import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { Input } from "@ui/custom/AuthInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";
import { useAuth } from "../context/AuthContext";
import { LoginFormSchema, loginSubmitMutation } from "@/queries/auth";
interface LoginDialogProps {
  isLoginDialogOpen: boolean;
  setIsLoginDialogOpen: (open: boolean) => void;
  onForgotPassword: () => void;
}

export const LoginDialog = ({
  isLoginDialogOpen,
  setIsLoginDialogOpen,
  onForgotPassword,
}: LoginDialogProps) => {
  const { login } = useAuth();
  const router = useRouter();
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Login successful!");
      setIsLoginDialogOpen(false);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message.includes("404")) {
          toast.error("User not found. Please check your email.");
        } else if (error.message.includes("401")) {
          toast.error("Incorrect password. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
  });

  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) =>
    loginMutation.mutate(data);

  return (
    <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
      <DialogContent className="bg-app-white p-8">
        <DialogHeader>
          <DialogTitle className="text-app-dark-brown text-3xl font-semibold">
            Feeling Hungry?
          </DialogTitle>
          <DialogDescription className="text-app-dark-brown text-lg">
            Just <span className="text-app-yellow">login</span> as ...
          </DialogDescription>
        </DialogHeader>

        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="meowth@nerdsgarten.com"
                      className="w-[20vw]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      className="w-[20vw]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-app-tan hover:text-app-yellow text-xs font-medium transition"
              >
                Forgot password?
              </button>
            </div>
            <div className="mt-10 flex w-full justify-center">
              <Button
                type="submit"
                className="bg-app-yellow hover:bg-app-yellow/60 active:bg-app-yellow/40 w-1/3 cursor-pointer rounded-full py-5 text-lg font-semibold active:scale-95"
              >
                Login
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-md flex flex-row justify-center gap-x-1 text-[#9D9081]">
          <p>Don&lsquo;t have an account?</p>
          <button
            onClick={() => {
              setIsLoginDialogOpen(false);
              router.push("/register");
            }}
            className="text-app-yellow shadow-app-yellow"
          >
            register
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
