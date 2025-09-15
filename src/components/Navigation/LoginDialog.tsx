import { zodResolver } from "@hookform/resolvers/zod";
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
import { z } from "zod";

import { apiClient } from "@/libs/axios";

interface LoginDialogProps {
  isLoginDialogOpen: boolean;
  setIsLoginDialogOpen: (open: boolean) => void;
}

const LoginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginDialog = ({
  isLoginDialogOpen,
  setIsLoginDialogOpen,
}: LoginDialogProps) => {
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async(data: z.infer<typeof LoginFormSchema>) => {
    const response = await apiClient.post("/auth/signin", {
      email: data.email,
      password: data.password,
      role: "customer",
    });

    // TODO: show toast notification
    if (response.status === 200) {
      setIsLoginDialogOpen(false);
      router.refresh();
    }
  };

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
            <div className="mt-10 flex w-full justify-center">
              <Button
                type="submit"
                className="bg-app-yellow w-1/3 rounded-full py-5 text-lg font-semibold"
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
