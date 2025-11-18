import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginService } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import { useSocketStore } from "@/store/useSocketStore";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormType = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // react Query
  const { mutateAsync, isPending } = useMutation({
    mutationFn: loginService,
  });

  const connectSocket = useSocketStore((s) => s.connectSocket);

  const onSubmit = async (values: LoginFormType) => {
    try {
      const res = await mutateAsync(values);

      toast.success("Login Successful!");

      // Save token + user
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // Connect socket globally
      connectSocket();

      navigate("/profile");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Login to Your Account
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="saroj@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type={"password"}
                      placeholder="your_password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Logging In..." : "Login"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-primary underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
