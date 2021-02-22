# Conclusion #

We started by learning what Docker container and image mean. Basically we started from an empty ubuntu with nothing installed into it. It's also possible to start from something else, but for now ubuntu had been enough.

This meant that we had to install almost everything manually, either from the command line or by using a setup file "Dockerfile" to install whatever we needed for the task at hand.

The process of dockerizing the applications meant a bit of configuration on our part, but now that we've done it and built the image anyone can pick up and run the application; no possible dependency or versioning issues.

Understanding the architecture and the technologies used is also part of making correct choices with the setup. This lead us to read the READMEs and documentation of the software involved in the setup, not just Docker. Fortunately in real life it's often us who are developing and creating the Dockerfile.

The starting and stopping of containers is a bit annoying, not to mention running two applications at the same time. If only there was some way, a tool, to make it simpler... to [compose](/part2).

**Remember to mark your exercises into the submission application! Instructions on how and what to submit are on the exercises page.**

## Don't wish to continue? ##

You can get the credits after any part of the course and end your progress there. If you are ready to end the course go to [completion](/completion)
