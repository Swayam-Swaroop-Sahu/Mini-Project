"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { ArrowLeft, Check, Utensils, Loader2, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react"
import axios from 'axios';
import { Toaster, toast } from "sonner";

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function FormPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({})
  const [activeTab, setActiveTab] = useState("personal")

  const steps = ["personal", "mess", "suggestion"]

  const form = useForm({
    defaultValues: {
      registrationNumber: "",
      studentName: "",
      blockAndRoom: "",
      diningMessName: "",
      messType: "",
      foodItemSuggestion: "",
      mealType: "",
      feasibilityForMassProduction: "",
    },
  })

  useEffect(() => {
    setProgress(((currentStep + 1) / steps.length) * 100)
  }, [currentStep])

  useEffect(() => {
    setActiveTab(steps[currentStep])
  }, [currentStep])

  const handleTabChange = (value) => {
    setActiveTab(value)
    setCurrentStep(steps.indexOf(value))
  }

  const goToNextStep = async () => {
    const currentTabFields = {
      personal: ["registrationNumber", "studentName", "blockAndRoom"],
      mess: ["diningMessName", "messType", "mealType"],
      suggestion: ["foodItemSuggestion", "feasibilityForMassProduction"],
    }

    const fields = currentTabFields[steps[currentStep]]
    const isStepValid = await form.trigger(fields)

    if (isStepValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    const values = form.getValues();
    setFormData(values);

    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Validation Error", {
        description: "Please check the form for errors.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/submit', {
        reg_no: values.registrationNumber,
        student_name: values.studentName,
        block_room: values.blockAndRoom,
        mess_name: values.diningMessName,
        mess_type: values.messType,
        food_suggestion: values.foodItemSuggestion,
        meal_type: values.mealType,
        feasibility: values.feasibilityForMassProduction,
      });
      toast.success("Feedback submitted successfully!", {
        description: "Thank you for your contribution to our mess menu.",
      });
      setIsSubmitted(true);
    } catch (error) {
      toast.error("Submission Failed", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to reset the form
  const handleHomeClick = (e) => {
    e.preventDefault();
    form.reset();
    setIsSubmitted(false);
    setCurrentStep(0);
    setFormData({});
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to top
  };

  // Function to scroll to the bottom (About section)
  const handleAboutClick = (e) => {
    e.preventDefault();
    const footer = document.getElementById("footer");
    footer.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background to-background/90">
      <Toaster />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 font-bold">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
              <Utensils className="h-4 w-4" />
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              Mess Menu System
            </span>
          </div>
          <nav className="ml-auto flex gap-4">
            <Link href="#" onClick={handleHomeClick} className="text-sm font-medium relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" onClick={handleAboutClick} className="text-sm font-medium relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="container max-w-3xl py-10 flex flex-col items-center">
          <Link
            href="#"
            onClick={handleHomeClick}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 group transition-colors self-start"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-20 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-purple-600/20">
                <Check className="h-12 w-12 text-primary animate-bounce" />
              </div>
              <h1 className="text-3xl font-bold">Thank You!</h1>
              <p className="text-muted-foreground max-w-md">
                Your feedback has been submitted successfully. We appreciate your contribution to improving our mess
                menu.
              </p>
              <div className="mt-8 p-6 bg-card rounded-xl border shadow-sm max-w-md w-full">
                <h3 className="font-semibold mb-4">Your Submission Summary</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{formData.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mess Type:</span>
                    <span className="font-medium">{formData.messType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meal Type:</span>
                    <span className="font-medium">{formData.mealType}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-4 group">
                  <ThumbsUp className="mr-2 h-4 w-4 group-hover:scale-125 transition-transform" />
                  Submit Another Response
                </Button>
                <Link href="#" onClick={handleHomeClick}>
                  <Button className="mt-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300">
                    Return Home
                  </Button>
                </Link>
              </div>
              <div className="flex gap-4 mt-4">
                <Button onClick={() => window.location.href = 'http://localhost:5000/api/report/excel'} variant="outline">
                  Download Excel Report
                </Button>
                <Button onClick={() => window.location.href = 'http://localhost:5000/api/report/pdf'} variant="outline">
                  Download PDF Report
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-8 text-center">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  Mess Menu Feedback Form
                </h1>
                <p className="text-muted-foreground">
                  Help us improve the dining experience by sharing your preferences and suggestions.
                </p>
              </div>

              <div className="mb-8 w-full max-w-3xl">
                <Progress value={progress} className="h-2 w-full" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-md animate-in fade-in-50 duration-300 w-full max-w-3xl">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="personal" disabled={isSubmitting}>
                      Personal Info
                    </TabsTrigger>
                    <TabsTrigger value="mess" disabled={isSubmitting}>
                      Mess Details
                    </TabsTrigger>
                    <TabsTrigger value="suggestion" disabled={isSubmitting}>
                      Your Suggestion
                    </TabsTrigger>
                  </TabsList>

                  <Form {...form}>
                    <form className="space-y-8">
                      <TabsContent value="personal" className="space-y-6 mt-0">
                        <div className="space-y-2">
                          <h2 className="text-xl font-semibold">Personal Information</h2>
                          <p className="text-sm text-muted-foreground">Please provide your basic details.</p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="registrationNumber"
                            rules={{
                              required: "Registration number is required",
                              minLength: {
                                value: 5,
                                message: "Registration number must be at least 5 characters",
                              },
                            }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Registration Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter your registration number"
                                    {...field}
                                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="studentName"
                            rules={{
                              required: "Name is required",
                              minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters",
                              },
                            }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Student Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter your full name"
                                    {...field}
                                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="blockAndRoom"
                          rules={{
                            required: "Block and room number is required",
                            minLength: {
                              value: 2,
                              message: "Block and room number must be at least 2 characters",
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Block and Room Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., A-101"
                                  {...field}
                                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      <TabsContent value="mess" className="space-y-6 mt-0">
                        <div className="space-y-2">
                          <h2 className="text-xl font-semibold">Mess Details</h2>
                          <p className="text-sm text-muted-foreground">Tell us about your mess preferences.</p>
                        </div>

                        <FormField
                          control={form.control}
                          name="diningMessName"
                          rules={{ required: "Please select a dining mess" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dining Mess Name</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                                    <SelectValue placeholder="Select dining mess" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Central Mess">Central Mess</SelectItem>
                                  <SelectItem value="North Block Mess">North Block Mess</SelectItem>
                                  <SelectItem value="South Block Mess">South Block Mess</SelectItem>
                                  <SelectItem value="East Wing Mess">East Wing Mess</SelectItem>
                                  <SelectItem value="West Wing Mess">West Wing Mess</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid gap-6 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="messType"
                            rules={{ required: "Please select a mess type" }}
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Mess Type</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                      <FormControl>
                                        <RadioGroupItem value="Veg" />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">Vegetarian</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                      <FormControl>
                                        <RadioGroupItem value="Non-Veg" />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">Non-Vegetarian</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                      <FormControl>
                                        <RadioGroupItem value="Special" />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">Special</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                      <FormControl>
                                        <RadioGroupItem value="Night Mess" />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">Night Mess</FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="mealType"
                            rules={{ required: "Please select a meal type" }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Meal Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-primary/20">
                                      <SelectValue placeholder="Select meal type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                                    <SelectItem value="Lunch">Lunch</SelectItem>
                                    <SelectItem value="Snacks">Snacks</SelectItem>
                                    <SelectItem value="Dinner">Dinner</SelectItem>
                                    <SelectItem value="Night Mess">Night Mess</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="suggestion" className="space-y-6 mt-0">
                        <div className="space-y-2">
                          <h2 className="text-xl font-semibold">Your Suggestion</h2>
                          <p className="text-sm text-muted-foreground">Share your food item suggestion with us.</p>
                        </div>

                        <FormField
                          control={form.control}
                          name="foodItemSuggestion"
                          rules={{
                            required: "Food suggestion is required",
                            minLength: {
                              value: 5,
                              message: "Suggestion must be at least 5 characters",
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Food Item Suggestion</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your food suggestion in detail"
                                  className="min-h-[120px] resize-y transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Please provide details about ingredients, preparation method, etc.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="feasibilityForMassProduction"
                          rules={{ required: "Please select yes or no" }}
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Feasible for Mass Production?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="Yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="No" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      <div className="flex justify-between pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={goToPreviousStep}
                          disabled={currentStep === 0 || isSubmitting}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>

                        <Button
                          type="button"
                          onClick={goToNextStep}
                          disabled={isSubmitting}
                          className={`gap-1 ${currentStep === steps.length - 1 ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" : ""}`}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              {currentStep === steps.length - 1 ? "Submit Feedback" : "Next"}
                              {currentStep === steps.length - 1 ? null : <ChevronRight className="h-4 w-4" />}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </Tabs>
              </div>
            </>
          )}
        </div>
      </main>
      <footer id="footer" className="border-t py-8 md:py-12 bg-card/50"> {/* Added id="footer" for scrolling */}
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2 font-bold">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
                <Utensils className="h-4 w-4" />
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                Mess Menu System
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Mess Menu System. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 md:items-end">
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
            {/* Added About section */}
            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>About: This app helps students suggest mess menu items.</p>
              <p>Built with React, Node.js, and MySQL for campus dining.</p>
              <p>Scroll up to submit your feedback!</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}